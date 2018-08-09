# Overview

A command-line tool written in Node JS for adding drivers and trips.


## Approach
I lean towards Functional Programming and try to keep the code as clear and side effect free as possible.


## Data
The data is structured as JSON. I picked this method because Node allows you to require JSON files and use them as Objects.
Using JSON also makes it easy to edit the data because you can use Object properties and indexes to create/read/update/delete values.


## Requirements
1. Node >=10.6.0
2. NPM >=6.3.0


## Installation
1. Clone this repo
2. Run the following commands:

```
$ cd ~/this/project
$ npm install
$ npm install -g
```

## Testing
I use two distinct testing patterns in this app: Automated and Manual.

### Automated Testing
Running the following command from the project root directory will run the automated tests:

```
$ npm test
```

There are two automated tests that evaluate error handing on input and calculation of velocity and duration.

> New patterns can be added to the tests by editing the `~/test/data.json` file.

### Manual Testing
Running the following command from the project root directory will run the manual test:
```
$ npm run test:manual
```

The manual test allows you to input a driver's name and validate if the driver has been added to the data store.

> When you run the manual test, you will be prompted to enter the driver's name.



## Usage
After installing, a local bin `cam` should now be available to use in the command-line.

### Adding A Driver
From the project root directory run:
```
$ cam Driver Carl
```

### Adding a Trip
From the project root directory run:

```
$cam Trip Carl 16:22 18:22 110
```

> If the driver does not exists, it will be created.


### Deleting A Driver
```
$ cam Driver Carl --delete
```

### Rename A Driver
```
$ cam Driver Carl --rename Karl
```

### List A Driver's Trips
```
$ cam Driver Carl --list
```

### List All Drivers
```
$ cam Driver --list
```

### Clear Driver Data
```
$ cam Driver Carl --overwrite
```


## Documentation
```
Usage: cam [command] [options]

  Options:

    -v, --version                         output the version number
    -h, --help                            output usage information

  Commands:

    Driver <name> [options]               Create, read, update, and delete drivers.
      -o, --overwrite [overwrite]         overwrite the driver record if it already exists.
      -r, --rename [rename]               rename a driver.
      -l, --list                          get the driver trips.
      -d, --delete [remove]               delete a driver.
      -h, --help                          output usage information

    Trip <name> <start> <end> <distance>  Create a new trip.

    Report [name]                         Get a report of speed and miles. Leaving the [name] blank will generate a report for all Drivers.
```
