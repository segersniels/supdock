use serde_json::Value;
use std::error::Error;
use std::io::{Read, Write};
use std::os::unix::net::UnixStream;
use std::{fmt, process};
use which::which;

#[derive(Debug)]
struct DockerError {
    message: String,
}

impl fmt::Display for DockerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl Error for DockerError {}

fn request(path: &str) -> Result<Value, Box<dyn Error>> {
    // Connect to the Docker socket
    let socket_path = "/var/run/docker.sock";
    let stream = UnixStream::connect(socket_path);

    match stream {
        Ok(mut socket) => {
            let mut response = Vec::new();
            let request = format!("GET {} HTTP/1.0\r\n\r\n", path);

            // Perform request and wait for response to complete and capture it
            socket.write_all(request.as_bytes())?;
            socket.read_to_end(&mut response)?;

            // Parse the response into a human readable format
            let response_str = String::from_utf8_lossy(&response);
            let mut parts = response_str.splitn(2, "\r\n\r\n");

            // Skip the response headers
            parts.next();
            let body = parts.next().unwrap_or("");
            let result = serde_json::from_str(body);

            match result {
                Ok(parsed_json) => Ok(parsed_json),
                Err(_) => Ok(serde_json::json!({})),
            }
        }
        Err(_) => Err(Box::new(
            DockerError { message: format!("Cannot connect to the Docker daemon at {socket_path:?}. Is the docker daemon running?") }
        )
    ),
    }
}

pub enum Type {
    AllContainers,
    RunningContainers,
    StoppedContainers,
    AllImages,
}

impl Type {
    fn get_path(&self) -> &'static str {
        match self {
            Type::AllContainers => "/containers/json?all=1",
            Type::StoppedContainers => {
                "/containers/json?filters=%7B%22status%22%3A%5B%22exited%22%5D%7D"
            }
            Type::RunningContainers => {
                "/containers/json?all=1&filters=%7B%22status%22%3A%5B%22running%22%5D%7D"
            }
            Type::AllImages => "/images/json",
        }
    }
}

pub fn get_containers(container_type: Type) -> Result<Vec<String>, String> {
    let mut containers = Vec::new();
    let result = request(container_type.get_path());

    match result {
        Ok(response) => {
            for container in response.as_array().unwrap() {
                let id = &container["Id"].as_str().unwrap()[..12];
                let name = &container["Names"][0]
                    .as_str()
                    .unwrap()
                    .trim_start_matches('/');
                let image = &container["Image"].as_str().unwrap();

                containers.push(format!("{} - {} ({})", id, name, image));
            }

            if containers.is_empty() {
                return Err("No containers found".to_string());
            }

            Ok(containers)
        }
        Err(err) => Err(err.to_string()),
    }
}

pub fn get_images() -> Result<Vec<String>, String> {
    let mut images = Vec::new();
    let result = request(Type::AllImages.get_path());

    match result {
        Ok(response) => {
            for image in response.as_array().unwrap() {
                if image["RepoTags"].is_array() && image["RepoTags"].as_array().unwrap().is_empty()
                {
                    continue;
                }

                let name = image["RepoTags"][0].as_str().unwrap();
                let id = &image["Id"].as_str().unwrap().replace("sha256:", "")[..12];

                images.push(format!("{} - {}", id, name));
            }

            if images.is_empty() {
                return Err("No images found".to_string());
            }

            Ok(images)
        }
        Err(err) => Err(err.to_string()),
    }
}

pub fn get_docker_binary_path() -> String {
    let result = which("docker");

    if let Err(_) = result {
        eprintln!("Could not find docker binary");
        process::exit(1);
    } else {
        result.unwrap().to_str().unwrap().to_string()
    }
}
