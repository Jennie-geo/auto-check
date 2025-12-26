import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('loan')
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async createLoan(@Req() req, @Body() dto: CreateLoanDto) {
    const userId = req.user.userId;

    const loan = await this.loanService.createLoan(userId, dto);

    return {
      message: 'Loan application submitted successfully',
      data: loan,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getAllLoans() {
    const loans = await this.loanService.retrieveLoans();
    return {
      message: 'All loan applications',
      data: loans,
    };
  }
}
