# Accounts

scratch private net

## account 0 miner etherbase

PrivateKey: 3e8d42bf3328f728cb27f8a8c55bd575ad967aabc11c5a7fa77a912ee65d9824
PublicKey: 02428f81b3d141658b2aed810c147605a536410284bd027a6917827c1bc0b43aab
Address: 6b41859d5da286265bfe09c33e771434223d9de2
Password: i love you

## account 1

PrivateKey: 283edf57ce3aac6da2ca004870c44b1c8763cbc9db3150cb9125f36dc98b16dc
PublicKey: 031a4cf0d962ae4f357d55af358f87b9c6ee0b6f8426fd9c884f7051fa7751bc34
Address: 4bac45928823a4aecb164f513ecf480280634212
Password: i love u

## account 2

PrivateKey: d415ce2437b1182eaac2a20d48a4a74d765683a5c3cebcd6bd4a0d80cae82f14
PublicKey: 03da424f8e9024850b5413df619be953695d09768dec219a4c32d49a0218b99b21
Address: 34115df7130b5019fb6df8cac5d067c00ebfe6a6
Password: i love u

## account 3

PrivateKey: 6b5bf55d95dfce24ef966be44778482c728886129ccf3ee949b9012cb85395d7
PublicKey: 02d9f18161e70d43816469e877dedc2a256666d83f44090bbfa588f871f892fb2b
Address: 4ae908f362b12d7928c98fda61ba525eedb0edc3
Password: i love u






# Other Notes

geth attach ipc:PRIVATE_NET/geth.ipc

cat > keyfile
4152e2e15130d285ae2ee9691b3d90f0464d3c5db16d6be77d571cc776b6095f ^D

geth --datadir ./PRIVATE_NET account import keyfile
# !! important to not leave it laying about
rm keyfile

geth --datadir PRIVATE_NET/ account list
# Account #0: {6b41859d5da286265bfe09c33e771434223d9de2}
# Account #1: {4bac45928823a4aecb164f513ecf480280634212}
# Account #2: {34115df7130b5019fb6df8cac5d067c00ebfe6a6}
# Account #3: {4ae908f362b12d7928c98fda61ba525eedb0edc3}

geth attach 
web3.fromWei(eth.getBalance(eth.coinbase), "ether")

web3.fromWei(eth.getBalance("6b41859d5da286265bfe09c33e771434223d9de2"), "ether")

eth.sendTransaction({
  from: '0x6b41859d5da286265bfe09c33e771434223d9de2',
  to: '0x4bac45928823a4aecb164f513ecf480280634212',
  value: web3.toWei(10, "ether")
})

eth.sendTransaction({
  from: '0x6b41859d5da286265bfe09c33e771434223d9de2',
  to: '0x34115df7130b5019fb6df8cac5d067c00ebfe6a6',
  value: web3.toWei(10, "ether")
})

eth.sendTransaction({
  from: '0x6b41859d5da286265bfe09c33e771434223d9de2',
  to: '0x4ae908f362b12d7928c98fda61ba525eedb0edc3',
  value: web3.toWei(10, "ether")
})

web3.fromWei(eth.getBalance("4bac45928823a4aecb164f513ecf480280634212"), "ether")
web3.fromWei(eth.getBalance("34115df7130b5019fb6df8cac5d067c00ebfe6a6"), "ether")
web3.fromWei(eth.getBalance("4ae908f362b12d7928c98fda61ba525eedb0edc3"), "ether")
