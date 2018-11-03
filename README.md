## Ethereum Dapp with React Redux Playground

This app uses [Create React App](https://github.com/facebook/create-react-app) for scaffolding,  [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/) for client side testing,  [Truffle](https://truffleframework.com/) as development framework for Ethereum, and [web3](https://github.com/ethereum/web3.js/) as Etherrum javascript api.

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

Start a [ganache](https://truffleframework.com/ganache) instance

```
ganache-cli
```

Start the app:

```
> yarn start
```

Then pick an ethereum address from the ganache instance to log into the app.