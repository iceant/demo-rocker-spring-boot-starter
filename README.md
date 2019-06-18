## Step 1
Clone the project
```sh
git clone https://github.com/iceant/demo-rocker-spring-boot-starter
```

## Step 2
check out `rocker-spring-boot-starter`
```sh
cd demo-rocker-spring-boot-starter
git submodule init
git submodule update
```

## Step 3
build jar package
> execute the following command from project root
```sh
mvn package
```

## Step 4
run jar
```sh
java -jar path/to/your/demo-rocker-spring-boot-starter-0.0.1-SNAPSHOT.jar
```

## Step 5 
open browser visit `http://localhost:8080/`

# Notes:
- The template will be compiled automatically.
- Compile the template will take time, maybe some exception will be thrown, just refresh the browser to check the result
- Modify the template in demo-rocker-spring-boot-starter/src/main/resources/templates/index.rocker.html and refresh the browser to check the result.
- Dynamic load template is only happed at develop phase. At runtime, the class will be load instead of parse the template files. 

