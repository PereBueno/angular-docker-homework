#peerTransfer booking portal

This application emulates the process of booking a payment with peerTransfer

## Requirements
 - Ruby 2.1.3
 - bundle gem

## Setup
```
$ bundle install
$ bundle exec rake db:create
$ bundle exec rake db:migrate
$ bundle exec rake db:seed
```

## Usage

The app has two interfaces, the interface and the API.

```
$ script/server
Thin web server (v1.6.3 codename Protein Powder)
Maximum connections set to 1024
Listening on 0.0.0.0:9292, CTRL+C to stop
```

### Web interface
Open on your browser

```
http://localhost:9292/payment
```

### API
```
$ curl http://localhost:9292/api
{"message":"Hello Developer"}

$ curl http://localhost:9292/api/bookings
{"bookings":[{"reference":"some reference","amount":10000,"amount_received":10000,"country_from":"ES","sender_full_name":"Name","sender_address":"Address","school":"School","currency_from":"USD","student_id":123456,"email":"some@example.com"}]}
```
