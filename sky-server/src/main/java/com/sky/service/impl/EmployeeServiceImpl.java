package com.sky.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.sky.constant.MessageConstant;
import com.sky.constant.StatusConstant;
import com.sky.context.BaseContext;
import com.sky.dto.EmployeeDTO;
import com.sky.dto.EmployeeLoginDTO;
import com.sky.dto.EmployeePageQueryDTO;
import com.sky.entity.Employee;
import com.sky.exception.AccountLockedException;
import com.sky.exception.AccountNotFoundException;
import com.sky.exception.PasswordErrorException;
import com.sky.mapper.EmployeeMapper;
import com.sky.result.PageResult;
import com.sky.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeMapper employeeMapper;

    /**
     * 员工登录
     *
     * @param employeeLoginDTO
     * @return
     */
    public Employee login(EmployeeLoginDTO employeeLoginDTO) {
        String username = employeeLoginDTO.getUsername();

        //1、根据用户名查询数据库中的数据
        Employee employee = employeeMapper.getByUsername(username);

        //2、处理各种异常情况（用户名不存在、密码不对、账号被锁定）
        if (employee == null) {
            //账号不存在
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }

        //密码比对
        // TODO 后期需要进行md5加密，然后再进行比对
        if (!employeeLoginDTO.getPassword().equals(employee.getPassword())) {
            //密码错误
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }

        if (employee.getStatus() == StatusConstant.DISABLE) {
            //账号被锁定
            throw new AccountLockedException(MessageConstant.ACCOUNT_LOCKED);
        }

        //3、返回实体对象
        return employee;
    }

    @Override
    public void save(EmployeeDTO employeeDtp) {
        try {
            Long userId = BaseContext.getCurrentId();
            System.out.println(Thread.currentThread().getId());
            Employee employee = new Employee();
            BeanUtils.copyProperties(employeeDtp, employee);
            employee.setPassword(DigestUtils.md5DigestAsHex("123456".getBytes()));
            employee.setStatus(1);
            employee.setCreateTime(LocalDateTime.now());
            employee.setUpdateTime(LocalDateTime.now());
            employee.setCreateUser(userId);
            employee.setUpdateUser(userId);
            employeeMapper.insert(employee);
        } catch (BeansException e) {
            log.error("员工保存失败");
            throw new RuntimeException(e);
        }
    }

    @Override
    public PageResult page(EmployeePageQueryDTO employeePageQueryDTO) {
        try {
            // 使用插件开始分页查询
            PageHelper.startPage(employeePageQueryDTO.getPage(), employeePageQueryDTO.getPageSize());

            Page<Employee> page = employeeMapper.pageQuery(employeePageQueryDTO);

            long total = page.getTotal();

            List<Employee> result = page.getResult();

            return new PageResult(total, result);
        } catch (Exception e) {
            log.error("员工分页查询失败");
            throw new RuntimeException(e);
        }
    }

    @Override
    public void startOrStop(Integer status, Long id) {
        log.info("员工状态：{}", status);
        employeeMapper.startOrStop(status, id);
    }

    @Override
    public Employee getById(Long id) {
        return employeeMapper.getById(id);
    }

    @Override
    public void update(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();
        BeanUtils.copyProperties(employeeDTO, employee);
        employee.setUpdateTime(LocalDateTime.now());
        employee.setUpdateUser(BaseContext.getCurrentId());
        employeeMapper.update(employee);
        log.info("员工信息修改成功");
    }

}
