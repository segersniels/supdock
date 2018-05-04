publish:
	@echo "==============================================="
	@changelog
	@echo "==============================================="
	@changelog all -m > CHANGELOG.md
	npm publish
