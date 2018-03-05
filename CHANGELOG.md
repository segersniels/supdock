# Changelog
## 0.2.3 (March 5, 2018)
##### Added
- `supdock prune` which removes all dangling images and exited containers.

## 0.2.2 (February 15, 2018)
##### Changed
- Basic README changes.
- `supdock compose start/stop` now shows the correct message for both actions.

## 0.2.11 (February 15, 2018)
##### Changed
- New npm README publish (hur dur).

## 0.2.1 (February 15, 2018)
##### Changed
- Fixed an issue where compose would trigger a prompt even when no action was specified.

## 0.2.0 (February 15, 2018)
##### Added
- `supdock compose [action]` searches your system for `docker-compose.yml` files and lets you start and stop these projects from whatever folder you are in.

## 0.1.9 (February 15, 2018)
##### Added
- `supdock env` shows the user the environment variables of the selected container.

## 0.1.8 (February 14, 2018)
##### Added
- `supdock history`

##### Changed
- Refactored big part of execution code removing a lot of duplicate code.
