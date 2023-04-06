create table if not exists movies(
	"id" serial primary key,
	"name" varchar(50) not null,
	"category" varchar(20) not null,
	"duration" integer not null,
	"price" integer not null
);