# NodeAPI
![License](https://img.shields.io/github/license/inequillibrium/NodeAPI.svg?style=flat-square)
![Issues](https://img.shields.io/github/issues/inequillibrium/NodeAPI.svg?style=flat-square)

Collect metrics in InfluxDB Database.
## the idea
The main idea behind this project is to collect data and write it to an InfluxDB instance on another host to display graphs on a status page.

## How does it work
This service collects metrics about cpu, ram, so on and sends them to an InfluxDB. 

This project powers and is powered by the following services
1. [status_page][1]
2. [DataAPI][2]
   
Read their Readme for installation instruction.

## Setup
**coming soon**

[1]: https://github.com/inequillibrium/status_page
[2]: https://github.com/inequillibrium/DataAPI