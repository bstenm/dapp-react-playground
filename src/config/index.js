const token = {
      priceInEther: 1, // in ether
      supply: 1000000,
      priceInWei: 1000000000000000000
};

const candidates =  ['Hilary','Trump', 'Jill'];

const routes = {
      home: "/",
      voting: "/",
      candidateInfo: candidate => `/info/${candidate}`
}

module.exports = {token, candidates, routes};