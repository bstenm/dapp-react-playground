const token = {
      priceInEther: 1,
      supply: 1000000,
      priceInWei: 1000000000000000000
};

const candidates =  ['Hilary','Trump', 'Jill'];

const routes = {
      home: "/",
      voting: "/",
      candidateInfoList: candidate => `/info/list/${candidate}`,
      candidateInfoForm: candidate => `/info/form/${candidate}`
};

const attachment = {
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
      maxSize: 300000,
      previewDim:  '50px'
};

const ipfsConfig = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };

module.exports = {token, candidates, routes, attachment, ipfsConfig};