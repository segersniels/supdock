use spinners::Spinner;

pub fn create_loader(message: &str) -> Spinner {
    Spinner::new(spinners::Spinners::Dots, message.into())
}
