.DEFAULT_GOAL := build

clean:
	cargo clean

build: clean
	export RUSTFLAGS="-C target-feature=+crt-static"
	cargo build --release

dev:
	cargo watch -- cargo build

lint:
	cargo clippy
	cargo fmt --check

lint-fix:
	cargo clippy --fix --allow-dirty
	cargo fmt

publish-beta:
	npm publish --tag beta

publish:
	npm publish

version:
	@cargo pkgid | cut -d# -f2 | cut -d: -f2
