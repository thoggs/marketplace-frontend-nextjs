pipeline {

	agent {
		label 'kub-node-agent'
    }

    options {
		buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    environment {
		PROJECT_KEY = 'marketplace-frontend-nextjs:latest'
		DOCKER_IMAGE = '361769563347.dkr.ecr.us-east-1.amazonaws.com/marketplace-frontend-nextjs'
		AWS_REGISTRY = '361769563347.dkr.ecr.us-east-1.amazonaws.com'
        AWS_REGION = 'us-east-1'
    }

    stages {

		stage('Install Dep & Build') {
			steps {
				container('node') {
					sh '''
						npm install
						npm run build
						cp -r .next/standalone ./
						cp -r .next/static ./
						cp -r public/* ./
            		'''
                }
            }
        }

		stage('Set up QEMU') {
			steps {
				container('docker') {
					sh 'docker run --rm --privileged multiarch/qemu-user-static --reset -p yes || true'
                }
            }
        }

        stage('Set up Docker Buildx') {
			steps {
				container('docker') {
					sh 'docker buildx create --use --name mybuilder || true'
                    sh 'docker buildx inspect --bootstrap'
                }
            }
        }

        stage('Login to AWS ECR') {
			steps {
				container('aws-cli') {
					withCredentials([
						usernamePassword(
							credentialsId: 'aws-username-password',
							usernameVariable: 'AWS_ACCESS_KEY_ID',
							passwordVariable: 'AWS_SECRET_ACCESS_KEY'
						)
						]) {
						sh '''
							aws ecr get-login-password --region $AWS_REGION > ecr-login.txt
						'''
						}
				}
			}
		}

		stage('Login to Docker') {
			steps {
				container('docker') {
					sh '''
						cat ecr-login.txt | docker login --username AWS --password-stdin $AWS_REGISTRY
					'''
				}
			}
		}

		stage('SonarQube Analysis') {
			steps {
				container('sonar-scanner') {
					withSonarQubeEnv('sonarqube-server') {
						withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
							sh '''
							sonar-scanner \
								-Dsonar.projectKey=$PROJECT_KEY \
								-Dsonar.sources=src \
								-Dsonar.exclusions="**/node_modules/**,**/dist/**,**/*.test.ts,**/*.spec.ts,**/*.test.js,**/*.spec.js" \
								-Dsonar.typescript.tsconfigPath=tsconfig.json \
							'''
						}
					}
				}
			}
		}

       stage('Build Multi-Arch') {
			steps {
				container('docker') {
					sh '''
                        docker buildx build \
                            --platform linux/amd64,linux/arm64 \
                            -t $DOCKER_IMAGE:latest \
                            --push .
                    '''
                }
            }
       }

    }
}
