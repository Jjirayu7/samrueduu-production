function MyModal(props) {
  return<>
      <div className="modal" tabIndex="-1" id={props.id}>
          <div className="modal-dialog modal-xl">
              <div className="modal-content custom-modal">
                  <div className="modal-header custom-header">
                      <h2 className="modal-title mx-5">{props.title}</h2>
                      <button 
                          style={{ borderColor: "#D8BABD", borderRadius: "15px" }} 
                          className="btn"
                          id={`${props.id}_btnClose`} 
                          type="button" 
                          data-dismiss="modal" 
                          aria-label="Close">
                          <i className="fa fa-times text-custom"></i>
                      </button>
                  </div>
                  <div className="modal-body">
                      <p>{props.children}</p>
                  </div>
              </div>
          </div>
      </div>
  </>
  }
  
  export default MyModal;