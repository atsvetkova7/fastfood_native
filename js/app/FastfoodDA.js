
    class FastFoodDA {
        constructor(){           
            this.fastFood = firebase.database().ref().child("fastFood");
            this.storage = firebase.storage();
        }
    
        setFoodPoint( objPoint ) {
            this.fastFood.push({
                name : objPoint.name,
                adress : objPoint.adress,
                description : objPoint.description,
                geolocation: objPoint.geolocation,
                photo : objPoint.photo
            }).key;         
        }

        setFoodPhoto(file) {
            var storageRef = this.storage.ref('img/'+ Date.now() + file.name);
            var task = storageRef.put(file);
            return task;
        }

        getFoodPoints ( callback ) { 
            this.fastFood.on('value', (snap) => {             
                callback ( snap );
            }); 
        }

        getFoodPoint ( itemKey ) {
            return this.fastFood.child(itemKey).once('value').then(function(snapshot) {                                       
                return snapshot;                                                  
            });
        }
    
        deleteFoodPoint ( itemKey ) {
            this.fastFood.child(itemKey).remove();
        }
    
        updateFoodPoint ( itemKey, obj ) {
            this.fastFood.child(itemKey).update({
                name: obj.name,
                adress: obj.adress,
                description: obj.description,
                geolocation: obj.geolocation,
                photo : obj.photo
            })
        } 
        
        
    
    
        setFeedbackPoint ( objFeedback ){
            this.fastFood.child(objFeedback.key + '/comment/').push({
                name : objFeedback.name,
                feedback : objFeedback.feedback,
                reting : objFeedback.reting
            }).key;
        }
    
        getFeedbackPoints ( key, callback ) { 
            this.fastFood.child(key + '/comment/').on('value', (snap) => {
                callback ( snap );
            }); 
        }

        getFeedbackPoint ( key, childKey ) {
            return this.fastFood.child(key + '/comment/' + childKey).once('value').then(function(snapshot) { 
                var objFeedback = {
                    key: snapshot.key,
                    name: snapshot.val().name,
                    feedback : snapshot.val().feedback,
                    reting : snapshot.val().reting
                }                                      
                return objFeedback;                                                  
            });
        }

        deleteFeedbackPoint ( key , childKey ){
            this.fastFood.child(key + '/comment/' + childKey).remove();            
        }

        updateFeedbackPoint ( parentKey , objFeedback ) {
            this.fastFood.child(parentKey + '/comment/' + objFeedback.key).update({
                name : objFeedback.name,
                feedback : objFeedback.feedback,
                reting : objFeedback.reting
            })
        } 

        getFeedbackReting ( key, callback ) { 
            this.fastFood.child(key + '/comment/').on('value', (snap) => {
                snap.forEach ( (snapChils) => {
                    callback ( snapChils );
                })
                
            }); 
        }

    }  
