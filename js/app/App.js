 
define([ 'uikit', 'navigo', 'app/View', 'app/Router'],function( UIkit, Navigo, View, Router ){
    class mainApp {

        constructor () {
            this.appAuth = new Auth();  
            this.appDAO = new FastFoodDA();
            this.appView = new View();
            this.appRouter = new Router();
        }
    
        init () {
            this.appAuthorization();            
            this.eventListener();
        }

        appAuthorization () {           
            this.appAuth.onAuthChange( (user) => {
                this.appRouter.routerAuth(user);
                    if (user) {
                        console.log('User was registered');
                    } else {
                        console.log('User was not registered'); 
                        this.appRouter.routerNavigateTo('login');   
                    }
            });
        }

        eventListener () {
            $(document).on('click', '#btnLogin', this.logIn.bind(this) );
            $(document).on('click', '#btnLogout', this.logOut.bind(this) );
            // $(document).on('click', '#btnSignin', this.signIn.bind(this) );

//Work with point fastfood
            $(document).on('change', '#form-photo', this.downloadPhoto.bind(this));
            $(document).on('click', '#btnSaveAdd', this.addPoint.bind(this));
            $(document).on('click', '#btnDelete', this.deletePoint.bind(this));
            $(document).on('click', '#btnSaveEdit', this.editPoint.bind(this));
            $(document).on('click', '#btnEdit', this.choosePointForEdit.bind(this));
            

//Work with point feedback  
            $(document).on('click', '#btnFeedback', this.choosePointFeedbackForAdd.bind(this));          
            $(document).on('click', '#btnAddFeedback', this.addFeedback.bind(this));  
            $(document).on('click', '#btnFeedbackDelete', this.deleteFeedback.bind(this));
            $(document).on('click', '#btnFeedbackEdit', this.choosePointFeedbackForEdit.bind(this));         
            $(document).on('click', '#btnFeedbackSave', this.editFeedback.bind(this));
            
            

//Work with View
            $(document).on('click', '#btnCancel', this.appView.cancel);
            $(document).on('click','#btnImg', this.appView.popupImg);

//Work with map
            $(document).on('click','#btnMap', this.initAppMap.bind(this));           
        }



        logIn (e) {
            e.preventDefault();

            let email = $('#txtEmail').val();      
            let password = $('#txtPassword').val();

            this.appAuth.logInAuthorization( email, password ).then( (firebaseUser) => {
                // Success 
                this.appRouter.routerNavigateTo('');
            }).catch( (error) => {
                // Error
                let errorCode = error.code;
                if (errorCode === 'auth/wrong-password') {
                    UIkit.modal.alert('Проверте пароль на корректность ввода.');
                } else {
                    UIkit.modal.alert('Такой пользователь не существует. Проверте правильность ввода логина.');
                }
                this.appRouter.routerNavigateTo('login');
            });           
        }

        signIn (e) {
            e.preventDefault();

            let email = $('#txtEmail').val();      
            let password = $('#txtPassword').val();

            this.appAuth.signUpAuthorization( email, password ).then( (firebaseUser) => {
                // Success 
                UIkit.modal.alert('Добро пожаловать в Fastfood corporation. Введите логин и пароль для входа');
                document.getElementById('txtEmail').value = '';
                document.getElementById('txtPassword').value = '';
            }).catch( (error) => {
                // Error
                UIkit.modal.alert('Такой пользователь уже существует');
            });           
        }

        logOut () {
            this.appAuth.logOutAuthorization();
        }

        downloadPhoto ( e ) {
            let file = e.target.files[0];
            let task = this.appDAO.setFoodPhoto(file);

            task.on('state_changed',   
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploader.value =percentage;
                },
                function error (err) {
                    UIkit.modal.alert(err);
                }
            );
            task.then( (snapshot) => {
                var downloadURL = snapshot.metadata.downloadURLs[0];
                $('#form-photo').attr('data-url', downloadURL);
            })
        }

        addPoint ( e ) {
            e.preventDefault();   
            //get new data from form 
            var objPoint = this.appView.getDataFromTable();

            if ( objPoint.name == "" || objPoint.adress == "" || objPoint.description == ""  ) {
                UIkit.modal.alert("Все поля должны быть заполнены!");
                return;
            }

                // if ( $('#form-photo')[0].files.length == 0 ) {
                //     UIkit.modal.alert("Загрузите фото. :)");
                //     return;
                // }

            //method for set new point
            this.appDAO.setFoodPoint(objPoint);
            //method for clean form
            this.appView.cleanForm();

            var message = $('#modal-add').html();
            UIkit.modal.dialog(message);
        }

        deletePoint ( e ) {
            e.preventDefault();

            let parentId  = this.appView.getKeyFoodPoint( e ); 

            UIkit.modal.confirm('Хотите удалить элемент?').then( () => {
                this.appDAO.deleteFoodPoint(parentId);
            }, function () {
                console.log('Rejected.')
            });     
        } 


        initAppMap ( e ) {
            let parentId  = this.appView.getKeyFoodPoint( e ); 

            this.appView.popupMap();
            this.appDAO.getFoodPoint( parentId ).then( ( value ) => {     
                var lat = +value.val().geolocation.lat;
                var lng = +value.val().geolocation.lng;
                var title = value.val().name;
                this.appView.initMapView( lat, lng, title );
            });
        }        

        choosePointForEdit(e){
            e.preventDefault();

            let parentId  = this.appView.getKeyFoodPoint( e );

            this.appRouter.routerNavigateTo('#!edit/'+ parentId);
        }


        editPoint ( e ) {
            e.preventDefault();

            let key = location.hash.split('/')[1];;
            let objPoint = this.appView.getDataFromTable();

            this.appDAO.updateFoodPoint( key, objPoint );
            this.appRouter.routerNavigateTo( '#!' );
        }

        choosePointFeedbackForAdd ( e ) {
            var parentKey = this.appView.getKeyFoodPoint( e );
            $('#form-feedback').attr('data-key', parentKey);
        }

        addFeedback (e) {
            e.preventDefault();

            let objFeedback = this.appView.getDataFeedbackForAdd();

            this.appDAO.setFeedbackPoint( objFeedback );
            this.appView.cleanFormFeedback();
        }

        deleteFeedback ( e ) {
            e.preventDefault();

            let parentKey = location.hash.split('/')[1];
            let key = this.appView.getKeyFeedbackPoint( e );

            UIkit.modal.confirm('Хотите удалить комментарий?').then( () => {       
                this.appDAO.deleteFeedbackPoint( parentKey, key ); 
            }, function () {
                console.log('Rejected.')
            });
            
        }

        choosePointFeedbackForEdit  ( e )  {
            e.preventDefault();

            let parentKey = location.hash.split('/')[1];
            let key = this.appView.getKeyFeedbackPoint( e );

            this.appDAO.getFeedbackPoint( parentKey, key ).then( ( objFeedback ) => { 
                this.appView.setDataFeedbackEdit( objFeedback );
                UIkit.modal($('#modal-edit-feedback')).show();
            });
            
        }

        editFeedback ( e ) {
            e.preventDefault();

            let parentKey = location.hash.split('/')[1];
            let obj = this.appView.getDataFeedbackForEdit();
            
            this.appDAO.updateFeedbackPoint ( parentKey, obj );

            let message = $('#modal-feedback-added').html();
            UIkit.modal($('#modal-edit-feedback')).hide();
            UIkit.modal.dialog(message);
        }



    }
    return mainApp;
})

