angular.module('app')

    .controller('meuPerfilCtrl', function($scope, $stateParams, firebase, MeuStorage, $timeout, $ionicLoading) {

        var usuarioLogado = firebase.auth().currentUser;
        var db = firebase.database().ref('Professor/' + usuarioLogado.uid);

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        db.on('value', function(data) {
            $timeout(function() {
                $scope.usuarioNome = data.val().Nome;
                $scope.usuarioEmail = usuarioLogado.email;
                if (data.val().DataNascimento) {
                    $scope.usuarioNascimento = data.val().DataNascimento;
                } else {
                    $scope.usuarioNascimento = "Data de Nascimento";
                }
                if (data.val().imgProfile) {
                    $scope.imgPerfil = data.val().imgProfile;
                } else {
                    $scope.imgPerfil = 'img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png';
                }
                if (data.val().NumeroCelular) {
                    $scope.usuarioCelular = data.val().NumeroCelular;
                } else {
                    $scope.usuarioCelular = "12345678910";
                }
            })
            $ionicLoading.hide();
        })
    })

    .controller('minhasTurmasCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope) {

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        var db = firebase.database().ref('Turma/');
        var obj = $firebaseArray(db);
        $scope.listaDeTurmas = obj;
        console.log($scope.listaDeTurmas);

        $scope.salvarTurma = function(dados) {
            $rootScope.turmaId = dados.$id;
            console.log(dados.$id);
        }

        $ionicLoading.hide();
    })

    .controller('escolherMateriaCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope) {

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        var db = firebase.database().ref('Turma/' + $rootScope.turmaId + '/Materias');
        var obj = $firebaseArray(db);
        $scope.listaDeMaterias = obj;
        console.log($scope.listaDeMaterias);
        $scope.turmaEscolhida = $firebaseObject(db.parent);

        $scope.salvarMateria = function(dados) {
            $rootScope.materiaId = dados.$id;
            console.log(dados.$id);
        }

        $ionicLoading.hide();
    })

    .controller('turmaEscolhidaCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope, $timeout) {

        var db = firebase.database().ref('Turma/' + $rootScope.turmaId + "/Materias/" + $rootScope.materiaId);
        var obj = $firebaseArray(db);

        $ionicLoading.show({
            template: 'Carregando ...'
        });
        $scope.materiaEscolhida = $rootScope.materiaId;

        $scope.listaDeAtvs = obj;
        console.log(obj);

        $ionicLoading.hide();

        $scope.salvarAula = function(dados) {
            $rootScope.aulaId = dados.$id;
            console.log(dados.$id);
        }

    })

    .controller('aulaEscolhidaCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope, $timeout) {

        var db = firebase.database().ref('Turma/' + $rootScope.turmaId + "/Materias/" + $rootScope.materiaId + "/" + $rootScope.aulaId);
        var obj = $firebaseObject(db);

        $ionicLoading.show({
            template: 'Carregando ...'
        });
        console.log(obj);
        $ionicLoading.hide();

        $scope.obj = obj;

    })

    .controller('novaAtvCtrl', function($scope, $state, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $rootScope, $ionicPopup) {

        var db = firebase.database().ref('Turma/' + $rootScope.turmaId + "/Materias/" + $rootScope.materiaId);
        var obj = $firebaseObject(db);

        $ionicLoading.show({
            template: 'Carregando ...'
        });
        $scope.form = {};
        console.log(obj);
        $ionicLoading.hide();
        $scope.listaDeAtvs = null;

        $scope.caixaSelecionada = function() {
            switch ($scope.form.tipoDeArquivo) {
                case "Documento":
                    $scope.source = "img/docicon.png";
                    $scope.form.source = "img/docicon.png";
                    break;
                case "Slide":
                    $scope.source = "img/slides.png";
                    $scope.form.source = "img/slides.png";
                    break;
                case "PDF":
                    $scope.source = "img/pdf-Icon.png";
                    $scope.form.source = "img/pdf-Icon.png";
                    break;
            }
        }

        var final = $firebaseObject(db.parent.parent);

        $scope.pegaArquivo = function(file) {
            console.log(file);
        }
        /* $scope.openFileDialog = function() {
             console.log('Clicou no input file');
             angular.element(document.querySelector('#pegaArquivo')).triggerHandler('click');
         };*/

        $scope.enviarAula = function() {
            console.log($scope.form);
            db.push($scope.form);
            $ionicPopup.alert({
                title: 'Aula enviada com sucesso!',
                template: 'O ' + $scope.form.tipoDeArquivo + ' de aula já está disponível para os alunos de ' + final.Curso + ' do ' + final.Semestre + ' Semestre.',
            }).then(function() {
                $state.go('menu.turmaEscolhida');
            }).catch(function(error) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: 'Ocorreu um erro durante o envio da aula. Tente novamente mais tarde.',
                })
            });
        }
    })

    .controller('minhaAgendaCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope) {

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        var db = firebase.database().ref('Turma/');
        var obj = $firebaseArray(db);
        $scope.listaDeTurmas = obj;
        console.log($scope.listaDeTurmas);

        $scope.salvarTurma = function(dados) {
            $rootScope.turmaId = dados.$id;
            console.log(dados.$id);
        }

        $ionicLoading.hide();

    })

    .controller('presencaMateriaCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope) {

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        var db = firebase.database().ref('Turma/' + $rootScope.turmaId + '/Materias');
        var obj = $firebaseArray(db);
        $scope.listaDeMaterias = obj;
        console.log($scope.listaDeMaterias);
        $scope.turmaEscolhida = $firebaseObject(db.parent);

        $scope.salvarMateria = function(dados) {
            $rootScope.materiaId = dados.$id;
            console.log(dados.$id);
        }

        $ionicLoading.hide();

    })

    .controller('presencaAlunoCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject, $firebaseArray, $rootScope, $filter, $state, $ionicPopup) {

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        var sync = firebase.database().ref('Aluno');
        var arraySync = $firebaseArray(sync);
        var db = firebase.database().ref('Turma/' + $rootScope.turmaId + '/Materias/' + $rootScope.materiaId);
        var obj = $firebaseArray(db);
        var CID = [];
        $scope.listaDeAlunos = [];

        $scope.listaDeAlunos = arraySync;
        $ionicLoading.hide();

        $scope.materiaEscolhida = $rootScope.materiaId;

        $scope.today = $filter('date')(Date.now(), 'dd/MM/yyyy');
        var hoje = $filter('date')(Date.now(), 'yyyy/MM/dd');


        $scope.enviarPresenca = function() {

            angular.forEach($scope.listaDeAlunos, function(aluno) {

                if (aluno.checado) {
                    db.child('Presenca').child(hoje).child(aluno.$id).set({
                        Nome: aluno.Nome,
                        Email: aluno.Email
                    });
                } else {
                    db.child('Presenca').child(hoje).child(aluno.$id).remove()
                        .then(function() {
                            console.log("Remove succeeded.")
                        })
                        .catch(function(error) {
                            console.log("Remove failed: " + error.message)
                        });
                }
            });

            $ionicPopup.alert({
                title: 'Presença marcada com sucesso!',
                template: 'Se precisar alterar a lista, marque todos os presentes novamente.',
            }).then(function() {
                $state.go('menu.presencaMateria');
            }).catch(function(error) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: 'Ocorreu um erro durante o envio da aula. Tente novamente mais tarde.',
                })
            });

        }

    })

    .controller('menuCtrl', function($scope, $stateParams, firebase, $state, $timeout) {

        var usuarioLogado = firebase.auth().currentUser;
        var db = firebase.database().ref('Professor/' + usuarioLogado.uid);

        $scope.deslogar = function() {
            firebase.auth().signOut();
        }

        db.on('value', function(data) {
            $timeout(function() {
                if (data.val().imgProfile) {
                    $scope.imgPerfil = data.val().imgProfile;
                } else {
                    $scope.imgPerfil = 'img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png';
                }
                $scope.usuarioNome = data.val().Nome;

            })

        })


    })

    .controller('loginCtrl', function($scope, $stateParams, firebase, $state, $ionicLoading) {

        $scope.login = {};

        $scope.mostrarLogin = function() {

            $ionicLoading.show({
                template: 'Carregando ...'
            });

            firebase.auth().signInWithEmailAndPassword($scope.login.email, $scope.login.senha)
                .then(function() {
                    $ionicLoading.hide();
                })
                .catch(function(error) {
                    $state.current;
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);

                    switch (errorCode) {
                        case ("auth/user-not-found"):
                            $scope.mensagemErro = "Usuário não encontrado";
                            break;
                        case ("auth/wrong-password"):
                            $scope.mensagemErro = "Senha incorreta";
                            break;
                        case ("auth/invalid-email"):
                            $scope.mensagemErro = "Email inválido";
                            break;
                    }

                    $ionicLoading.hide();
                });
        }


    })

    .controller('signupCtrl', function($scope, $stateParams, firebase, $ionicPopup, $ionicLoading, $state) {

        $scope.usuario = {};

        $scope.mensagemErro = "";

        $scope.enviarEmail = function() {

            $ionicLoading.show({
                template: 'Carregando ...'
            });

            var auth = firebase.auth();
            var emailAddress = $scope.usuario.email;

            auth.sendPasswordResetEmail($scope.usuario.email).then(function() {
                // Email sent.
                $ionicPopup.alert({
                    title: 'Email enviado com sucesso!',
                    template: 'Por favor verifique seu email para alterar sua senha de login',
                }).then(function() {
                    $state.go('login');
                });
                $ionicLoading.hide();
            }, function(error) {
                // An error happened.
                $ionicLoading.hide();
                switch (error.code) {
                    case ("auth/user-not-found"):
                        $scope.mensagemErro = "Usuário não encontrado";
                        break;
                    case ("auth/invalid-email"):
                        $scope.mensagemErro = "Email inválido";
                        break;
                }
            });
        }
    })
    .controller('editarPerfilCtrl', function($scope, firebase, $state, $cordovaCamera, $firebaseObject, $filter, $ionicPopup) {

        var usuarioLogado = firebase.auth().currentUser;
        var db = firebase.database().ref('Professor/' + usuarioLogado.uid);
        var obj = $firebaseObject(db);

        $scope.editar = {};

        var imagem = null;

        obj.$loaded()
            .then(function(data) {
                if (usuarioLogado.displayName) {
                    $scope.usuarioNome = usuarioLogado.displayName;
                } else {
                    $scope.usuarioNome = "Nome do Professor";
                }
                if (obj.DataNascimento) {
                    $scope.usuarioNascimento = obj.DataNascimento;
                } else {
                    $scope.usuarioNascimento = "Data de Nascimento";
                }
                if (obj.imgProfile) {
                    $scope.imgPerfil = obj.imgProfile;
                } else {
                    $scope.imgPerfil = 'img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png';
                }
                if (obj.NumeroCelular) {
                    $scope.usuarioCelular = obj.NumeroCelular;
                } else {
                    $scope.usuarioCelular = "12345678910";
                }
            })
            .catch(function(error) {
                console.error("Error:", error);
            });
        /*#############--Função de atualização--#############*/

        $scope.atualizarPerfil = function() {

            if ($scope.editar.nome) {
                obj.Nome = $scope.editar.nome;
            }
            if ($scope.editar.celular) {
                obj.NumeroCelular = $scope.editar.celular;
            }
            if ($scope.editar.nascimento) {
                obj.DataNascimento = $filter('date')($scope.editar.nascimento, 'dd/MM/yyyy');
            }
            if (imagem) {
                obj.imgProfile = $scope.imgPerfil;
            }
            obj.$save().then(function(ref) {
                ref.key === obj.$id; // true
                $state.go('menu.meuPerfil');
            }, function(error) {
                $ionicPopup.alert({
                    title: error.name,
                    template: error.message,
                });
            });

            usuarioLogado.updateProfile({
                displayName: $scope.editar.nome,
            }).then(function() {
                // Update successful.
                $state.go('menu.meuPerfil');
            }, function(error) {
                // An error happened.
                $ionicPopup.alert({
                    title: error.name,
                    template: error.message,
                });
            });
        }
        /*#############--Função de chamada câmera--#############*/
        $scope.tirarFoto = function() {
            var opcoes = {
                quality: 70,
                correctOrientation: true,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                destinationType: Camera.DestinationType.DATA_URL,
            }

            $cordovaCamera.getPicture(opcoes)
                .then(function(foto) {
                    $scope.imgPerfil = "data:image/jpeg;base64," + foto;
                    imagem = "1";
                }, function(error) {
                    $ionicPopup.alert({
                        title: error.name,
                        template: error.message,
                    });
                })
        }

    })