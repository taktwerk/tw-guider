import routes from './routes/index';

const requestHandler = {
  get: (url: string) => {
    processRequest(url, null, 'get');
  },
  post: (url: string, data: any) => {
    processRequest(url, data, 'post');
  },
  put: (url: string, data: any) => {
    processRequest(url, data, 'put');
  },
  delete: (url: string) => {
    processRequest(url, null, 'delete');
  }
};


export default requestHandler;


const processRequest = (url = '', data = null, type: 'get'| 'post' | 'put' | 'delete') => {
  const urlParams =  new URLSearchParams(window.location.search);

  let response = { status: 'Error', data: null }

  for(let route of routes) {
    if(route.type == type && route.path == url) {
      let controller = import('./controllers/' + route.controller);
      console.log(controller);


    }
  }


}
