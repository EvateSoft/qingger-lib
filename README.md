# qingger-lib

Qingger util library for node/web project



## Usage

### Install

```console
$ npm install qingger-lib 
```

## Example:

### DateTimeParse

```javascript

import {QinggerLibDateTime} from "qingger-lib";

let tsfmt = QinggerLibDateTime.dateTimeParse("2018-01-10").toFormat();
console.log(tsfmt);

```


### distribute
```bash
$ tsc
$ git add . / git commit
$ npm config set registry https://registry.npmjs.org/
$ npm login
$ npm who am i
$ npm version patch / minor / major
$ npm publish
$ npm logout

```

## License

ISC
