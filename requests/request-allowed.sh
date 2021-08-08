# jq is a dependency that parse json values.
# sed made a replace some output values. in below case, the "" is replaced with empty space
# tee saves the output value in log file

# local host
HOST=http://0.0.0.0:3000
# remote host
# HOST=https://ducf879jk5.execute-api.us-east-1.amazonaws.com

TOKEN=$(curl -X POST \
  --silent \
  -H 'Content-Type: application/json' \
  --data '{"username": "andrade_regis", "password": "123"}' \
  $HOST/dev/login \
  | jq '.token' \
  | sed 's/"//g' \
  | tee token.log  
)

echo "Token: $TOKEN"
echo

#first returned param is printed at $1
curl --silent $HOST/dev/public \
  | xargs echo "Public API:$1"

#first returned param is printed at $1
curl --silent -H "Authorization:$TOKEN" \
  $HOST/dev/private \
  | xargs echo "Private API:$1"
