const token = {
      price: 0.000000001, // in ether
      supply: 1000000
};

const candidates =  ['Hilary','Trump', 'Jill'];

const routes = {
      home: "/",
      voting: "/",
      candidateInfo: candidate => `/info/${candidate}`
}

module.exports = {token, candidates, routes};