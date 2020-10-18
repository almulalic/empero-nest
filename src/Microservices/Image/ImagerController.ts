import { Ok } from '../../Common';
import { ImagerService } from './ImagerService';
import { AuthenticationInterceptor } from '../../API/Auth/AuthenticationInterceptor';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Post, UseInterceptors, UploadedFile, Controller, Param, Get, Res, Delete } from '@nestjs/common';
import { AuthorizationInterceptor } from '../../API/Auth/AuthorizationInterceptor';

@Controller('imager')
@UseInterceptors(AuthenticationInterceptor)
export class ImagerController {
  constructor(private readonly ImagerService: ImagerService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(AuthorizationInterceptor)
  public async UploadFile(@UploadedFile() image) {
    return Ok(await this.ImagerService.UploadImage(image));
  }

  @Get('/:imageId')
  public async GetImage(@Param('imageId') imageId: number, @Res() res) {
    return res.end(await this.ImagerService.GetImageBuffer(imageId), 'binary');
  }

  @Delete('/:imageId')
  @UseInterceptors(AuthorizationInterceptor)
  public async DeleteImage(@Param('imageId') imageId: number, @Res() res) {
    return res.end(await this.ImagerService.DeleteImage(imageId));
  }
}
