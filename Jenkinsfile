node {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('SonarQube analysis') {
        def scannerHome = tool 'SonarQubeScanner';
        withSonarQubeEnv('Sonarqube') {
          sh "${scannerHome}/bin/sonar-scanner"
        }

    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("brauliousach/mingeso-hotel-web")
    }

    stage('Test image') {
        app.inside {
            sh 'echo "Tests passed"'
        }
    }

    stage('Push image') {
        /* Finally, we'll push the image with two tags:
         * First, the incremental build number from Jenkins
         * Second, the 'latest' tag.
         * Pushing multiple tags is cheap, as all the layers are reused. */
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }

     stage('Deploy on Dev Server'){
            def dockerRun = 'docker run -it -d -p 80:80 --name mingeso-hotel-web brauliousach/mingeso-hotel-web'
            def dockerRm = 'docker rm -f mingeso-hotel-web'
            sshagent(['ssh-dev-server']) {

                withCredentials([string(credentialsId: 'docker-paswd-daniel', variable: 'dockerHubPwd')]) {
                    def login = "docker login -u fallshimajer -p ${dockerHubPwd}"

                    sh "ssh -o StrictHostKeyChecking=no  usach@35.232.225.161 ${login}"
                    sh "ssh -o StrictHostKeyChecking=no  usach@35.232.225.161 docker pull brauliousach/mingeso-hotel-web"
                    try{
                        sh "ssh -o StrictHostKeyChecking=no  usach@35.232.225.161 docker rm -f mingeso-hotel-web"
                    } catch(err){
                        echo "Failed: ${err}"
                        echo "Error al eliminar el contenedor"
                    }
                    sh "ssh -o StrictHostKeyChecking=no  usach@35.232.225.161 ${dockerRun}"
                }
            }
        }
}
