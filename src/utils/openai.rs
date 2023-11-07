use reqwest::Error;
use serde::Deserialize;
use std::process;

const MODEL_TO_USE: &str = "gpt-3.5-turbo";

fn generate_system_message() -> String {
    r#"You will be asked to analyze logs of a docker container.
        Try to give a concise analysis to the best of your capabilities and search for things that need fixing.
        Don't bother writing an analysis if no errors are found.
        Write your analysis in markdown.

        Use the following template to write your analysis:
        """
        # Analysis
        ## Errors
        ## Improvements
        ## Conclusion
        """
        "#.to_string()
}

#[derive(Deserialize, Debug)]
struct Message {
    content: String,
}

#[derive(Deserialize, Debug)]
struct Choice {
    message: Message,
}

#[derive(Deserialize, Debug)]
struct ResponseError {
    message: String,
    code: String,
}

#[derive(Deserialize, Debug)]
struct Response {
    choices: Option<[Choice; 1]>,
    error: Option<ResponseError>,
}

fn create_payload(system_message: &str, content: &str) -> serde_json::Value {
    serde_json::json!({
        "model": MODEL_TO_USE,
        "messages": [
            { "role": "system", "content": system_message },
            { "role": "user", "content": content }
        ],
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
    })
}

async fn get_chat_completion(body: &serde_json::Value) -> Result<String, Error> {
    let api_key = std::env::var("OPENAI_API_KEY").unwrap_or_else(|_| {
        println!("Error: OPENAI_API_KEY environment variable not set");
        process::exit(0);
    });

    let response = reqwest::Client::new()
        .post("https://api.openai.com/v1/chat/completions")
        .header(
            reqwest::header::AUTHORIZATION,
            format!("Bearer {}", api_key),
        )
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .body(serde_json::to_string(body).unwrap())
        .send()
        .await?;

    let result: Result<String, Error> = response.text().await;
    match result {
        Ok(response) => {
            let data: Response = serde_json::from_str(response.as_str()).unwrap();

            if data.error.is_some() {
                let error = data.error.unwrap();

                match error.code.as_str() {
                    "rate_limit_exceeded" | "context_length_exceeded" => {
                        println!("Error: The provided logs are too large. Try limiting the amount of provided logs with `--lines`");
                        std::process::exit(1);
                    }
                    _ => {
                        println!("Error: {}", error.message);
                        std::process::exit(1);
                    }
                }
            }

            if let Some(choice) = data.choices {
                Ok(choice[0].message.content.clone())
            } else {
                println!("Error: {}", response.as_str());
                std::process::exit(1);
            }
        }
        Err(_) => {
            println!("Error: Could not fetch response from OpenAI");
            std::process::exit(1);
        }
    }
}

pub async fn analyze_logs(logs: &str) -> Result<String, Error> {
    let system_message = generate_system_message();
    let body = create_payload(&system_message, logs);

    get_chat_completion(&body).await
}
