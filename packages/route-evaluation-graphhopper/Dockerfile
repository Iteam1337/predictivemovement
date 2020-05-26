FROM openjdk:14-jdk-alpine
COPY ./build/libs/route-evaluation-graphhopper-0.0.1-SNAPSHOT.jar /usr/app/
WORKDIR /usr/app
ENTRYPOINT ["java", "-jar", "route-evaluation-graphhopper-0.0.1-SNAPSHOT.jar"]