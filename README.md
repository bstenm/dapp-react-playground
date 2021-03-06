## Ethereum Dapp with React Redux Playground

This app uses [Create React App](https://github.com/facebook/create-react-app) for scaffolding,
[Rematch](https://rematch.gitbooks.io/rematch/) (a wrapper around [Redux](https://redux.js.org/)) and [Immer](https://github.com/mweststrate/immer) for state management, [Formik](https://github.com/jaredpalmer/formik) for form management, [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/) for client side testing,  [Truffle](https://truffleframework.com/) as development framework for Ethereum, and [web3](https://github.com/ethereum/web3.js/) as Etherrum javascript api. The contracts are written in [Solidity](https://solidity.readthedocs.io/).

The app also uses [IPFS](https://ipfs.io/) to upload attachments through the [INFURA](https://blog.infura.io/) service.

#### Testing

Testing the client side is done using [Jest](https://jestjs.io/) as test runner and [Enzyme](https://airbnb.io/enzyme/) as test utility.

Run the test for the React client side:
```
> yarn test
```

Run the test for the Solidity contracts:
```
> truffle test
```

#### Linting

Linting is based on the [Airbnb Style Guide](https://github.com/airbnb/javascript) and [Prettier](https://github.com/prettier/prettier).

Run the linter:

```
> yarn lint
```

#### Starting the app

Start a [ganache](https://truffleframework.com/ganache) instance:
```
> ganache-cli
```

Then migrate the contracts:
```
> truffle migrate --reset
```

Then start the app:
```
> yarn start
```

And pick an ethereum address from the ganache instance to log into the app.
