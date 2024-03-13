import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { Request, Response } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from '../decorator/role.decorator';
import { AccessTokenGuard } from './../auth/access-token.guard';
import { Role } from './../enums/role.enum';
import { RolesGuard } from './../guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('list')
  getOrderList(
    @Body() body,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('type', new DefaultValuePipe(10), ParseIntPipe) type = 0,
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    const userId: number = body.userId;
    return this.orderService.findUserOrders(
      {
        page,
        limit,
        route: `${process.env.SERVER}/order/list`,
      },
      type,
      userId,
    );
  }

  @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('check-order-user')
  checkOrderUser(@Body() data) {
    return this.orderService.checkOrderUser(data);
  }

  @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }
}

@Controller('admin/order')
@Roles(Role.Admin, Role.Manager, Role.Employee)
@UseGuards(AccessTokenGuard, RolesGuard)
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Get('sales-statistic')
  async salesStatistic(
    @Query('year') year = new Date().getFullYear().toString(),
  ) {
    return this.orderService.salesStatistic(year);
  }

  @Get('overview')
  async overview() {
    return this.orderService.overview();
  }

  @Get('total-revenue')
  async totalRevenue() {
    return this.orderService.calculateTotalRevenue();
  }

  @Get('total-order')
  async totalOrder() {
    return this.orderService.count();
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name') name = '',
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.orderService.findAll(
      {
        page,
        limit,
        route: `${process.env.SERVER}/admin/order`,
      },
      name,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch('update-status/:id')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
