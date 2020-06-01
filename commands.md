```
./external-initiator "{\"name\":\"cfx-mainnet\",\"type\":\"conflux\",\"url\":\"http://mainnet-jsonrpc.conflux-chain.org:12537\"}" --chainlinkurl "http://localhost:6688/"
```

```
./external-initiator "{\"name\":\"cfx-mainnet\",\"type\":\"conflux\",\"url\":\"http://localhost:3000\"}" --chainlinkurl "http://localhost:6688/"
```

```
cd ~/.chainlink-ropsten && docker run -p 6688:6688 -v ~/.chainlink-ropsten:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
