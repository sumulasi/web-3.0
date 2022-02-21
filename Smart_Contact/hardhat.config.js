// https://eth-ropsten.alchemyapi.io/v2/9KBdB1C9j6twtakU17w-KuhddmIZOn4z

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/9KBdB1C9j6twtakU17w-KuhddmIZOn4z',
      accounts: ['2d93e4f9a48613a365818ed41303daf75c6308396d6915bda135bfef838dce7f']
    }
  }
}