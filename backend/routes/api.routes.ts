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

// 2. Auth & Users
apiRouter.get('/auth/users', (req: Request, res: Response) => {
  res.json({ success: true, data: dataService.getUsers() });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = dataService.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Email không tồn tại trong hệ thống' });
  }
  res.json({
    success: true,
    data: {
      user,
      token: `demo-token-${user.id}`
    }
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
