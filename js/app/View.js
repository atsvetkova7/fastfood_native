
define([ 'handlebars', 'uikit', 'app/GoogleMap', 'list'  ],function( Handlebars, UIkit, GoogleMap  ){
    class View {
        constructor() {
            this.appDAO = new FastFoodDA();
            this.appMap = new GoogleMap();
        }

//method for loading html page
        loadHTML( url, callback ) {
            $.ajax ({
                type: "GET",
                url: url,
                dataType: 'html',
                success: function( data ) { 
                    $('#app-content').html($(data).find('#content'));
                    if(callback) callback();                   
                }, 
                error: function(){
                    UIkit.modal.alert('Что-то пошло не так');
                }
            })
    
        }

//method for rendering html template
        renderHandlebarsTemplate( path , inElement , withData , callback) {
            var source, template;
            $.ajax({
                url: path,
                dataType: "text",
                success: function (data) {
                    source = data;
                    //pagination
                    // var monkeyList = new List('pagination__list', {
                    //     valueNames: ['feedback-edit__item'],
                    //     page: 6,
                    //     pagination: true
                    //   }); 
                    template = Handlebars.compile(source);
                    $(inElement).html(template(withData));
                    if(callback) callback();  
                }, 
                error: function(){
                    UIkit.modal.alert('Что-то пошло не так');
                }
            });
    
        }

//method for loading default html
        routingToDefaultHtml () {
            this.loadHTML( 'pages/app.html');
            setTimeout( this.showTabelFoodPoints.bind(this), 800);        
        }

//method for loading add html
        routingToAddHtml () {
            this.loadHTML( 'pages/add.html', this.appMap.autocompliteInit );
        }

//method for loading edit html
        routingToEditHtml ( params ) {
            this.loadHTML( 'pages/edit.html');
            var parentId = params;
            this.showPointForEdit( parentId );
            this.showPointsComment( parentId );
        }

//method for loading login html
        routingToLoginHtml () {
            this.loadHTML( 'pages/login.html' );
        }

        showTabelFoodPoints() {
            this.appDAO.getFoodPoints( ( snap ) => {
                let arr = [];
                snap.forEach ( (snapChild) => {
                    var obj = {
                        key : snapChild.key,
                        value : snapChild.val()
                    } 
                    arr.push( obj );
                })  
                var context = {
                    row : arr
                };
                this.renderHandlebarsTemplate('pages/Template/tabelTamplate.html','#result', context);
            })   
        }

        showPointForEdit ( parentId ) {
            var arr = [];
            this.appDAO.getFoodPoint(parentId).then( (value) => {     
                var context = {
                    key : value.key,
                    value : value.val()
                } 
                this.renderHandlebarsTemplate('pages/Template/editTemplate.html','#form-edit-point-result', context, this.appMap.autocompliteInit);
            });
        }

        showPointsComment ( parentId ) {
            this.appDAO.getFeedbackPoints( parentId, ( snap ) => {
                var arr = []; 
                       snap.forEach (function (snapChild) {
                        var obj = {
                            key : snapChild.key,
                            value : snapChild.val()
                         }                         
                         arr.push(obj);
                       })  
                let reting = this.calcReting( parentId );       
                var context = {
                    list : arr,
                    reting: reting  
                };
                this.renderHandlebarsTemplate('pages/Template/editCommentTemplate.html','#edit-comment-result', context);
            }) 

        }

        calcReting ( parentId ) {
            var sum = 0;
            var i = 0;       
            this.appDAO.getFeedbackReting ( parentId, ( snap ) => {
                sum += +snap.val().reting;
                i++;    
            })
            if (sum != 0) {
                var reting = (sum / i).toFixed(1);
                // console.log(reting + ' средний ретинг по точке');
            }
            if (reting == undefined) {
                reting = 0;
            }
            return reting;
        }

//get points
        getDataFromTable (){
            var objPoint = {
                name: document.getElementById("form-name").value,
                adress: document.getElementById("form-adress").value,
                description: document.getElementById("form-description").value,
                photo: $('#form-photo').attr('data-url'),
                geolocation: {
                    lat: $('#form-adress').attr('data-lat'),
                    lng: $('#form-adress').attr('data-lng')
                } 
            }
            return objPoint;
        }

        getDataFeedbackForAdd () {
            var objFeedback = {
                key: $('#form-feedback').attr('data-key'),
                name: document.getElementById("feedback-name").value,
                feedback: document.getElementById("form-feedback-comment").value,
                reting: document.getElementById("form-feedback-reting").value
            }
            return objFeedback;
        }

        getDataFeedbackForEdit () {
            var objFeedback = {
                    name: document.getElementById('feedback-edit-name').value,
                    feedback: document.getElementById('feedback-edit-comment').value,
                    reting: document.getElementById('feedback-edit-reting').value,
                    key: $('#form-feedback-edit').attr('data-key')
                }
            return objFeedback;
        }


        getKeyFoodPoint (e) {
            var target = e.target;
            var parentElem = target.closest('tr');
            var parentId = $(parentElem).attr('data-key');
            return parentId;
        }

        getKeyFeedbackPoint (e) {
            var target = e.target;
            var parentElem = target.closest('li');
            var key = $(parentElem).attr('data-keyChild');
            return key;
        }

        setDataFeedbackEdit ( objFeedback ) {
            document.getElementById('feedback-edit-name').value = objFeedback.name;
            document.getElementById('feedback-edit-comment').value = objFeedback.feedback;
            document.getElementById('feedback-edit-reting').value = objFeedback.reting;
            $('#form-feedback-edit').attr('data-key', objFeedback.key);
        }
        
//clean input       
        cleanForm() {
            document.getElementById("form-name").value = '';
            document.getElementById("form-adress").value = '';
            document.getElementById("form-description").value = ''; 
            document.getElementById("form-photo").value = '';
            $('#form-photo').attr('data-url', '');
            document.getElementById("uploader").value = '0';
        }

        cleanFormFeedback () {
            document.getElementById("feedback-name").value = '';
            document.getElementById("form-feedback-comment").value = '';
            document.getElementById("form-feedback-reting").value = '';
        }

        popupImg ( e ) {
            var target = e.target;
            var src = target.src;
            var img = $('#img').attr('src' , src);
        }

        popupMap () {
            var el = $('#modal-map');
            UIkit.modal(el).show();
        }

        initMapView ( lat, lng, title ) {
            this.appMap.initMap( lat, lng, title );
        }

        cancel () {
            if ($('.pac-container')) {
                $('.pac-container').remove();
            }
            $('#modal-feedback').remove();
            $('#modal-edit-feedback').remove();
            $('#modal-map').remove();
            $('#modal-media-image').remove();
        }

        
    }
    return View;
    
})
