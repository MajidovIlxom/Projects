import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "../admin/Models/admin.models";




@Injectable()
export class AdminRoleGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService ){}
    canActivate(context: ExecutionContext){
        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization
        if (!authHeader)
        {
            throw new UnauthorizedException("Admin unauthorized")
        } 
        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({
                message: "Foydalanuvchi authrizatsiyadan o'tmagan"
            })
        }
        async function verify(token: string, jwtService: JwtService){
            const admin: Partial<Admin> = await jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_KEY
            });
            if (!admin){
                throw new UnauthorizedException("Admin unauthorized")
            }
            if (!admin.is_active){
                throw new BadRequestException("Admin is not active")
            }
            // Faqat "admin" rolini tekshirish
            if (admin.role !== 'admin') {
                throw new BadRequestException("Foydalanuvchi admin roliga ega emas")
            }
            return true
        }
        return verify(token, this.jwtService)
    }
}
