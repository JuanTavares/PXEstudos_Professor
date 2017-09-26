angular.module('app')

    .controller('meuPerfilCtrl', function($scope, $stateParams, firebase, MeuStorage, $timeout, $ionicLoading, $firebaseStorage) {

        var usuarioLogado = firebase.auth().currentUser;
        var db = firebase.database().ref('Professor/' + usuarioLogado.uid);

        var storageRef = firebase.storage().ref("Professor_imgProfile/" + usuarioLogado.uid + "/IMG_0223.JPG");
        var storage = $firebaseStorage(storageRef);
        $scope.foto = storageRef;
        $ionicLoading.show({
            template: 'Carregando ...'
        });

        db.on('value', function(data) {
            $timeout(function() {
                $scope.usuarioNome = data.val().Nome;
                $scope.usuarioEmail = usuarioLogado.email;
                $scope.usuarioNascimento = data.val().DataNascimento;
                $scope.imgPerfil = "img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png";
                $scope.usuarioCelular = data.val().NumeroCelular;
            })
            $ionicLoading.hide();
        })
    })

    .controller('minhasTurmasCtrl', function($scope, $stateParams, firebase, MeuStorage, $ionicLoading, $firebaseObject) {

        $ionicLoading.show({
            template: 'Carregando ...'
        });

        var db = firebase.database().ref('Turma/');
        var obj = $firebaseObject(db);
        $scope.listaDeTurmas = obj;

        $ionicLoading.hide();
    })

    .controller('minhaAgendaCtrl', function($scope, $stateParams, firebase) {

        var user = firebase.auth().currentUser; //funciona

    })

    .controller('menuCtrl', function($scope, $stateParams, firebase, $state, $timeout) {

        var usuarioLogado = firebase.auth().currentUser;
        var db = firebase.database().ref('Professor/' + usuarioLogado.uid);

        $scope.deslogar = function() {
            firebase.auth().signOut();
        }

        db.on('value', function(data) {
            $timeout(function() {
                $scope.imgPerfil = "img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png"
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

    .controller('signupCtrl', function($scope, $stateParams, firebase) {

        $scope.mensagemErro = "Funcionalidade em desenvolvimento";

    })
    .controller('editarPerfilCtrl', function($scope, firebase, $state, $cordovaCamera, $firebaseObject, $filter) {

        var usuarioLogado = firebase.auth().currentUser;
        var db = firebase.database().ref('Professor/' + usuarioLogado.uid);
        var obj = $firebaseObject(db);

        $scope.editar = {};

        /*if (usuarioLogado.photoURL) {
            $scope.imgPerfil = usuarioLogado.photoURL;
        } else {*/
            $scope.imgPerfil = "img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png";
        //}

        obj.$loaded()
            .then(function(data) {
                $scope.usuarioNome = usuarioLogado.displayName;
                $scope.usuarioNascimento = obj.DataNascimento;
                $scope.usuarioCelular = obj.NumeroCelular;
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
            obj.$save().then(function(ref) {
                ref.key === obj.$id; // true
                $state.go('menu.meuPerfil');
            }, function(error) {
                console.log("Error:", error);
            });

            usuarioLogado.updateProfile({
                displayName: $scope.editar.nome,
                //photoURL: URL DO STORAGE DO FIREBASE,
                photoURL: "img/q1szUiFXSw6qNm6WvncI_eG3nOGIZSnGIMROFgK7n_students.png",
            }).then(function() {
                // Update successful.
                $state.go('menu.meuPerfil');
            }, function(error) {
                // An error happened.
                console.log(error);
            });
        }

        $scope.tirarFoto = function() {
            var opcoes = {
                quality: 70,
                correctOrientation: true,
                allowEdit: true
            }

            $cordovaCamera.getPicture(opcoes)
                .then(function(foto) {
                    $scope.imgPerfil = foto;
                }, function(erro) {
                    console.log(erro);
                })
        }

    })