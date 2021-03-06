# sql-lint  

![Imgur](https://i.imgur.com/Le90iGL.png)

![Imgur](https://i.imgur.com/JgAhLFp.png)

![Imgur](https://i.imgur.com/lo7MMoI.png)

sql-lint is a linter for MySQL, it brings back any error from the MySQL server
as well as custom errors written for sql-lint.

`sql-lint` will show errors about the following things

- DELETE statements missing WHERE clauses
- DROP statements with invalid things to be dropped
- Odd code points in queries
- Any MySQL error*

* `sql-lint` brings back errors from the MySQL server too. It will catch **any** MySQL error.
these include but are not limited to:

- Unknown columns on a table 
- A non existent database
- A non existent table
- Syntax errors

etc...

## Running / Installation

There are binaries on the [releases page](https://github.com/joereynolds/sql-lint/releases) for Mac, Linux and Windows.

### Linting a query

sql-lint works on queries with the `--query` flag.

```
> sql-lint --query="DELETE FROM test;"
query:1 Delete missing WHERE, intentional?
```

### Linting a file  

sql-lint works on files with the `--file` flag.

```
> sql-lint --file="test/test.sql" 
test/test.sql:13 Bad code point
test/test.sql:40 Delete missing WHERE, intentional?
test/test.sql:6 Database 'test' does not exist.
test/test.sql:10 Database 'dykes_reservations' does not exist.
test/test.sql:11 Database 'dykes_res' does not exist.
test/test.sql:13 [ER_PARSE_ERROR] You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'FRO�' at line 1
test/test.sql:16 [ER_NO_DB_ERROR] No database selected
test/test.sql:29 [ER_NO_DB_ERROR] No database selected
test/test.sql:54 [ER_NO_SUCH_TABLE] Table 'symfony.dont_exist' doesn't exist
```

### Linting stdin

sql-lint works with stdin if you don't supply any arguments.


```
> echo "DELETE FROM test;" | sql-lint
stdin:1 Delete missing WHERE, intentional?
```

## Editor integration   

There is a patch [here](https://github.com/joereynolds/sql-lint/issues/30) which will allow `sql-lint` to work with ALE
for Vim and Neovim.

## Configuration

Configuring `sql-lint` with connection details allows errors from the server to come through.
You'll probably want these as they supply even more information about what's going wrong.

You can connect in two ways:

### Via CLI

You can connect via the command line if you wish with the respective flags.

```
sql-lint --host="localhost" --user="root" --password="hunter2" --query="SELECT 1;"
```

### Via `config.json`

A configuration file for `sql-lint` can reside in `~/.config/sql-lint/config.json`

You should put the following in there for more intelligent errors to come through

```
{
    "host": "localhost",
    "user": "root",
    "password": "hunter2"
}
```

## Contributing

### To test  

```
./build/build.sh //This will run more than just the tests (recommended)
```

### Working with the docker container

First, make sure port `3306` is available locally.
(You can do this by inspecting the output of `sudo lsof -i :3306` and `docker ps` and `kill`ing anything using that port)
Now do:

```
docker-compose up --build -d --force-recreate
```

At this point the container(s) will be up and ready to use.
You can login with the following credentials: `mysql -u root -ppassword`.

Here's an example of a query:

```
docker exec sqllint_mysql_1 mysql -u root -ppassword -e "SHOW DATABASES"
```

### Connecting sql-lint to the docker container

Change your config file in `~/.config/sql-lint/config.json` to have the following values:

```
{
    "host": "localhost",
    "user": "root",
    "password": "password"
}
```

## Troubleshooting

### I'm not seeing any warnings

Run `sql-lint -f your-file` and it will display the exception.
Add the `-v` flag for more information.

### It's telling me there's a syntax error when there's clearly not.

Chances are you're using an old(er) version of MySQL.
`EXPLAIN`ing on `INSERT|UPDATE|DELETE` was added in Mysql 5.6.
