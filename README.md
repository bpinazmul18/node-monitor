# Project name:

## Node monitor:
Node monitor is a monitoring app to check up/down time and notify user.

## git clone:

repos [git](https://github.com/bpinazmul18/node-monitor).

```bash
git clone https://github.com/bpinazmul18/node-monitor.git
```

## Installation:

```nodejs
yarn install
```

## Usage:

```nodejs
yarn start
```
## Configure env:
### create file config/development.json

```json
{
    "name": "node-monitor --Development",
    "port": 9000,
    "envName": "default",
    "secreteKey": "",
    "maxChecks" : 5,
    "twilio" : {
      "from" : "twilio_number",
      "accountSID" : "twilio_accountSID",
      "authToken" : "twilio_authToken"
    }
  }
```

## Contributing:
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Inspired by:
[Learn with Sumit - LWS - Bangladesh](https://www.youtube.com/channel/UCFM3gG5IHfogarxlKcIHCAg).
