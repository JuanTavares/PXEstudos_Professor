angular.module('app')
    .service('MeuStorage', function($http, firebase) {

        var db = firebase.database();

        return {

            pegarTurmas: function() {
                return db.ref('Turma');
            },

            gravarDadosUsuario: function(dados) {

            },

        }
    });