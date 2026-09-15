// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// EXPRESS API ROUTER (/api/*)
// ==============================================================================
import { Router, Request, Response } from 'express';
import { dataService } from '../services/dataService.ts';

export const apiRouter = Router();

// 1. Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Hệ thống Quản lý Thiết bị Trường Cao đẳng X',
    timestamp: new Date().toISOString(),
    database: 'Supabase / Hybrid Data Service'
  });
});

// 2. Auth & Users (cung cấp cả alias /users và /login)
const getUsersHandler = (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getUsers() });
};
apiRouter.get('/auth/users', getUsersHandler);
apiRouter.get('/users', getUsersHandler);

const loginHandler = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email đăng nhập' });
  }

  const result = dataService.verifyUserCredentials(email, password);
  if (!result.success) {
    return res.status(401).json({ success: false, message: result.message });
  }

  res.json({
    success: true,
    data: {
      user: result.user,
      token: result.token,
      expires_at: result.expires_at
    }
  });
};
apiRouter.post('/auth/login', loginHandler);
apiRouter.post('/login', loginHandler);

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Chưa cung cấp token xác thực' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const user = dataService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Phiên làm việc đã hết hạn hoặc không hợp lệ' });
  }

  res.json({ success: true, data: user });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Đăng xuất thành công khỏi hệ thống' });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const { userId, full_name, phone, department_id, department_name } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Thiếu định danh người dùng' });
  }

  const updated = dataService.updateUserProfile(userId, { full_name, phone, department_id, department_name });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }

  res.json({ success: true, data: updated, message: 'Cập nhật thông tin tài khoản thành công' });
});

apiRouter.post('/auth/change-password', (req: Request, res: Response) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới' });
  }

  const result = dataService.changeUserPassword(userId, currentPassword, newPassword);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  res.json({ success: true, message: result.message });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ email cơ quan' });
  }

  const user = dataService.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản với email này trong hệ thống' });
  }

  res.json({
    success: true,
    message: `Đã gửi liên kết đặt lại mật khẩu đến hòm thư ${email}. Vui lòng kiểm tra hộp thư công vụ của bạn.`
  });
});

// 3. Dashboard Stats
apiRouter.get('/dashboard/stats', (req: Request, res: Response) => {
  try {
    const stats = dataService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Departments & Categories
apiRouter.get('/departments', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getDepartments() });
});

apiRouter.get('/categories', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getCategories() });
});

// 5. Rooms
apiRouter.get('/rooms', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getRooms() });
});

apiRouter.get('/rooms/:id', (req: Request, res: Response) => {
  const room = dataService.getRoomById(req.params.id);
  if (!room) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
  res.json({ success: true, data: room });
});

apiRouter.post('/rooms', (req: Request, res: Response) => {
  try {
    const room = dataService.createRoom(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/rooms/:id', (req: Request, res: Response) => {
  try {
    const updated = dataService.updateRoom(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/rooms/:id', (req: Request, res: Response) => {
  try {
    const success = dataService.deleteRoom(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Equipment
apiRouter.get('/equipment', (req: Request, res: Response) => {
  const { search, category_id, room_id, condition, status } = req.query;
  const list = dataService.getEquipment({
    search: search as string,
    category_id: category_id as string,
    room_id: room_id as string,
    condition: condition as string,
    status: status as string
  });
  res.json({ success: true, total: list.length, data: list });
});

apiRouter.get('/equipment/:id', (req: Request, res: Response) => {
  const item = dataService.getEquipmentById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị' });
  res.json({ success: true, data: item });
});

apiRouter.post('/equipment', (req: Request, res: Response) => {
  try {
    const item = dataService.createEquipment(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/equipment/:id', (req: Request, res: Response) => {
  try {
    const updated = dataService.updateEquipment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/equipment/:id', (req: Request, res: Response) => {
  const ok = dataService.deleteEquipment(req.params.id);
  res.json({ success: ok });
});

// 7. Transfers
apiRouter.get('/transfers', (req: Request, res: Response) => {
  const { equipment_id } = req.query;
  const list = dataService.getTransfers(equipment_id as string);
  res.json({ success: true, data: list });
});

apiRouter.post('/transfers', (req: Request, res: Response) => {
  try {
    const item = dataService.createTransfer(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 8. Damage Reports
apiRouter.get('/damage-reports', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getDamageReports() });
});

apiRouter.post('/damage-reports', (req: Request, res: Response) => {
  try {
    const report = dataService.createDamageReport(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.patch('/damage-reports/:id/status', (req: Request, res: Response) => {
  const { status, note } = req.body;
  const updated = dataService.updateDamageReportStatus(req.params.id, status, note);
  if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
  res.json({ success: true, data: updated });
});

// 9. Maintenance Records
apiRouter.get('/maintenance', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getMaintenanceRecords() });
});

apiRouter.post('/maintenance', (req: Request, res: Response) => {
  try {
    const record = dataService.createMaintenanceRecord(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 10. Inventory
apiRouter.get('/inventory/sessions', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getInventorySessions() });
});

apiRouter.post('/inventory/sessions', (req: Request, res: Response) => {
  try {
    const session = dataService.createInventorySession(req.body);
    res.status(201).json({ success: true, data: session });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/inventory/sessions/:id/items', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getInventoryItems(req.params.id) });
});
