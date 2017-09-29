## JS API Doc
[![Build Status](https://travis-ci.org/ezirmusitua/jsAPIdoc.svg?branch=master)][![Coverage Status](https://coveralls.io/repos/github/ezirmusitua/jsAPIdoc/badge.svg?branch=master)](https://coveralls.io/github/ezirmusitua/jsAPIdoc?branch=master)(https://travis-ci.org/ezirmusitua/jsAPIdoc)  

Add jsdoc in your API, and use this tool to generate web doc and basic debug tool  

### Features  
1. Scan and generate document json files
2. Fast create document web site  
3. Try API in web site  
4. Try API in command line      

### Installation    
```bash  
npm install jsAPIdoc
```    

### Usage    
```bash  
# assume your routes in file project/routes
jsAPI gen project/routes
# create docs in project/, inside or it will contain json file of each single route  
# serve an API site, use the data in project/docs    
jsAPI serve  
# try API in command line  
jsAPI try <route@name>  
```    

### Support  
Issues & PR are welcome      

### Todos
 - [ ] Let me start with some tests
 - [ ] Just Code  
 - [ ] Add CodeBeat badge
 - [ ] Add NPM downloads badge      

### License  
MIT
