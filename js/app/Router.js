define([ 'navigo', 'app/View' ],function( Navigo, View ){

class Router {
        constructor(){
            this.viewApp = new View();
            this.router = new Navigo( null, true, '#!' );   
        }

        routerAuth (user) {
            this.router.on({
                'add' : () => {
                    this.viewApp.routingToAddHtml();
                },
                'edit/:id' : ( params ) => {
                    this.viewApp.routingToEditHtml( params.id );
                },
                'login' : () => {
                    this.viewApp.routingToLoginHtml();
                }
            });
            this.router.on(
                (user) => {
                    this.viewApp.routingToDefaultHtml();
                }, {
                    before: function (done, params) {
                        if(!user) {
                          done(false);
                        } else {
                          done()
                        }
                      }
                }   
            );
            this.router.resolve();
            
        }    

        routerNavigateTo ( path ) {
            this.router.navigate( path );
        }
    }  
    return Router;

})