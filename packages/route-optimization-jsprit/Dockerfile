FROM openjdk:15
WORKDIR /app

COPY gradlew /app/gradlew
COPY gradle/wrapper /app/gradle/wrapper
COPY src /app/src
COPY settings.gradle /app/settings.gradle
COPY build.gradle /app/build.gradle
COPY gradlew.bat /app/gradlew.bat

RUN ./gradlew clean build

ENTRYPOINT ["java", "-jar", "/app/build/libs/route-optimization-jsprit-0.0.1-SNAPSHOT.jar"] 