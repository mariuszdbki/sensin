create table if not exists devices (
  id integer primary key, 
  name text
); 

create table if not exists symbols (
  code text primary key, 
  name text
); 

create table if not exists readings (
  id integer primary key autoincrement, 
  reading_log_id not null,
  device_id integer not null, 
  symbol_code text, 
  value text, 
  reading_timestamp datetime, 
  record_timestamp datetime default current_timestamp
); 

create table if not exists reading_log (
  id integer primary key autoincrement, 
  device_id integer, 
  hash text,
  reading_timestamp datetime default current_timestamp
); 
