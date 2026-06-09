const { withProjectBuildGradle } = require('expo/config-plugins');

const withAndroidJvmTarget = (config) => {
    return withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents += `
// Force Kotlin JVM Target to 17 for all modules
allprojects {
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions {
      jvmTarget = "17"
    }
  }
}
`;
        }
        return config;
    });
};

module.exports = withAndroidJvmTarget;
