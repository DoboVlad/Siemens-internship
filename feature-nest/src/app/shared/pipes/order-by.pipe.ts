import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(items: any[], order='', column: string = ''): any[] {
    if(!items || order === '' || !order) return items;
    if(items.length <= 1) return items;
   
    if (!column || column === '') { 
      if(order==='asc'){return items.sort()}
      else{return items.sort().reverse();}
    }
    else{
     
      if(order === 'asc'){  
      items = items.sort((a,b) =>(a[column] - b[column]));
      }
      else if(order === 'desc'){
       items = items.sort((a,b) => (b[column] - a[column]) );
      }
    
    }
  
    return items;
  }

}
