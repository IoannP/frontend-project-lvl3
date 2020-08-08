lint:
	npx eslint .

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack
