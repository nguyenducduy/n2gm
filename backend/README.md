# Mysql to Elasticsearch

- Enable mysql binlog
- Using golang to sync mysql to elasticsearch (automatic)
	- `go-mysql-elasticsearch -config=river.toml`

# Upload file with GraphQL example curl

`
	curl localhost:9000/graphql \
	-F operations='{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) { id } }", "variables": { "file": null } }' \
	-F map='{ "0": ["variables.file"] }' \ -F 0=@prosody.txt

`

# Pm2 (Fork mode)

- pm2 start --name backend npm -- start

# Elasticsearch dead lock subsys

- rm -rf /var/lock/subsys/elasticsearch
- Stop -> Remove Subsys -> Start

# Bulk action using https://github.com/typeorm/typeorm/blob/master/docs/entity-manager-api.md
