import { Post, UseInterceptors, UploadedFile, Controller, Param, Get, Header, Res, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Ok } from '../Common';
import { ImagerService } from './ImagerService';

@Controller('imager')
export class ImagerController {
  constructor(private readonly ImagerService: ImagerService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  public async UploadFile(@UploadedFile() image) {
    return Ok(await this.ImagerService.UploadImage(image));
  }

  @Get('/:imageId')
  public async GetImage(@Param('imageId') imageId: number, @Res() res) {
    return res.end(await this.ImagerService.GetImageBuffer(imageId), 'binary');
  }

  @Delete('/:imageId')
  public async DeleteImage(@Param('imageId') imageId: number, @Res() res) {
    return res.end(await this.ImagerService.DeleteImage(imageId));
  }
}
