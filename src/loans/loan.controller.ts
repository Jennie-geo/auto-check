import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
}
