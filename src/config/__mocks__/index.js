const token = {
      supply: 1000000,
      available: 750000,
      priceInWei: 1000000000,
};

const candidates = [
      'Asif Ali Zardari',
      'Khalifa Bin Zayed',
      'Petro Poroshenko',
];

const routes = {
      home: '/',
      voting: '/',
      candidateInfoList: candidate => `/info/list/${candidate}`,
      candidateInfoForm: candidate => `/info/form/${candidate}`,
};

const attachment = {
      allowedTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/svg+xml',
            'application/pdf',
      ],
      maxSize: 300000,
      previewDim: '50px',
      listingDim: '70px',
};

const ipfsConfig = {
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
};

const ipfsRoot = 'https://ipfs.io/ipfs/';

module.exports = {
      token,
      candidates,
      routes,
      attachment,
      ipfsConfig,
      ipfsRoot,
};
