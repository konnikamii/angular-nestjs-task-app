import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core'; 
import { DimensionsService } from '../../../services/dimensions.service';
import { DimensionContextType } from '../../../utils_other/types';
import { defaultDims } from '../../../utils_other/defaults';

@Component({
  selector: 'app-index',
  imports: [ ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  animate = signal(false);
  dims: DimensionContextType = defaultDims
   
  dimensionsService = inject(DimensionsService);
  cardClassName = "group flex flex-col gap-6 pb-6 p-4 rounded-lg shadow-round border shadow-gray-300 hover:shadow-gray-400 bg-white  border-gray-300 hover:border-gray-400 dark:shadow-gray-800 dark:hover:shadow-gray-700 dark:bg-gray-700 dark:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 relative overflow-hidden"
  ngOnInit() {
    setTimeout(()=>{this.animate.set(true)},100) 
    this.dimensionsService.dims$.subscribe(dims => {
      this.dims = dims 
    }); 
  }
  ngOnDestroy() {
    this.animate.set(false)
  }
  
}
