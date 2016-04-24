# ethereum

I'm exploring interfacing with ethereum by implementing something as close to the bone as possible.

See `bin/ethereum` command line utility. Performs common interfacing tasks.

Keys are recklessly exposed, so this is recommended only for use with private test/development network (bin/start_ethereum).

Copy `keys.json.start` to `keys.json`, it contains the first account (allocated funds in `genesis.json`)

`bin/ethereum -k` (adds more keys)

