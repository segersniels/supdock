# Changelog

## 2.6.0

- Speed improvements
- Changed confirmation prompts (yes/no) to just pressing Y/N buttons for a more natural flow
- When trying to restart a stopped container using fuzzy searching it will now prompt the user that the container isn't running and asks if it needs to be started instead

## 2.5.0

- Add support for `docker cat` to display file contents of a file inside the docker container
- Prompt flow improvements

## 2.4.6

- A lot of internal code cleanup since last changelog
- Minor bugfixes
- Speed optimizations
- Now has 0 external dependencies since everything is contained within supdock

## 2.4.2

- Speed improvements

## 2.4.1

- `port` and `top` commands
- More commands now support fuzzy searching

Since the internal code changed quite a bit some bugs might have snuck in.
To report bugs run `supdock` with the `DEBUG=*` environment variable and create an issue with the output.

## 2.3.0

- Internal cleanup of code
- Config reusability optimisations and backwards compatibility
- New `short-logs` config option to set a default limit of 500 lines to the `logs` command
